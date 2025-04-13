"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { User, Mail, Calendar, Clock } from 'lucide-react';
import { UserData } from '@/types';

export default function Dashboard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as UserData));
        
        setUsers(usersData);
      } catch (err) {
        // Use the error parameter
        console.error('Error fetching users:', err);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Format date safely - handles undefined values
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      // Remove the unused 'error' parameter
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-800 p-4 rounded-lg">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Client Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="h-5 w-5 text-orange-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">
                    {user.firstName || 'N/A'} {user.lastName || ''}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {user.subscriptionStatus === "active" ? (
                      <span className="text-green-500">Active</span>
                    ) : user.subscriptionStatus === "canceled" ? (
                      <span className="text-red-500">Canceled</span>
                    ) : (
                      <span className="text-yellow-500">Pending</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mt-6">
                <div className="flex">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-300">{user.email || 'No email'}</span>
                </div>
                
                <div className="flex">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-300">
                    {user.planType || 'No plan'} ({user.billingCycle || 'N/A'})
                  </span>
                </div>
                
                <div className="flex">
                  <Clock className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-300">
                    Joined: {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-700/50 px-6 py-3">
              <button className="text-orange-500 hover:text-orange-400 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No clients found in the database.</p>
        </div>
      )}
    </div>
  );
}