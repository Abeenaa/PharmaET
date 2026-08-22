import React, { useState } from 'react'
import Layout from '@/components/common/Layout'
import { useAuth } from '@/hooks/useAuth'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <Layout>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-48">
            <div className="space-y-2">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'system', label: 'System Settings' },
                { id: 'data', label: 'Data Management' },
                { id: 'about', label: 'About' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">User Profile</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-medium text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <p className="text-lg font-medium text-gray-900 capitalize">{user?.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-medium text-gray-900">{user?.phone || 'Not set'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">System Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Offline Mode</p>
                      <p className="text-sm text-gray-600">Allow offline operations</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Auto Sync</p>
                      <p className="text-sm text-gray-600">Sync automatically when online</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Low Stock Alerts</p>
                      <p className="text-sm text-gray-600">Notify about low inventory</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-4">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Clear Cache
                  </button>
                  <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                    Export Data
                  </button>
                  <button className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                    Reset Application
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About PharmaET</h3>
                <div className="space-y-4 text-sm text-gray-700">
                  <p>
                    <strong>Version:</strong> 1.0.0
                  </p>
                  <p>
                    <strong>Build Date:</strong> {new Date().toLocaleDateString()}
                  </p>
                  <p className="pt-4">
                    PharmaET is a modern pharmacy management system designed to help pharmacy
                    managers efficiently manage inventory, sales, and operations across multiple
                    branches.
                  </p>
                  <p>
                    © 2026 PharmaET. All rights reserved.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
