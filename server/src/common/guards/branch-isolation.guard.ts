import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class BranchIsolationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Super Admin can access all branches
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Other roles must have branch_id and can only access their branch
    if (!user.branch_id) {
      throw new ForbiddenException('User must be assigned to a branch');
    }

    // Store branch_id in request for use in services
    request.branch_id = user.branch_id;

    return true;
  }
}
