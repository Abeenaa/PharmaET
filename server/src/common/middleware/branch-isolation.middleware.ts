import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class BranchIsolationMiddleware implements NestMiddleware {
  constructor(private prisma: DatabaseService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return next();
    }

    const user = req.user as any;

    // Super Admin can access all branches
    if (user.role === 'SUPER_ADMIN') {
      return next();
    }

    // Attach branch_id to request for use in services
    req['userBranchId'] = user.branch_id;

    // Log branch isolation in audit log
    if (req.path !== '/api/auth/logout' && req.path !== '/api/auth/refresh-token') {
      try {
        await this.prisma.auditLog.create({
          data: {
            performed_by: user.id,
            branch_id: user.branch_id,
            action: 'CREATE' as any,
            entity_type: 'USER_ACCESS',
            entity_id: user.id,
            old_values: null,
            new_values: JSON.stringify({
              path: req.path,
              method: req.method,
              timestamp: new Date(),
            }),
          },
        });
      } catch (error) {
        // Silently fail audit logging to not block requests
      }
    }

    next();
  }
}
