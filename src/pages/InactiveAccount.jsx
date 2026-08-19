import React from 'react';
import { useSession, signOut } from '../lib/auth-client';
import { FiAlertTriangle, FiLogOut } from 'react-icons/fi';

export default function InactiveAccount() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content text-center">
        <div className="card w-full max-w-md shadow-2xl bg-base-100 border border-warning/30">
          <div className="card-body items-center text-center">
            <div className="w-16 h-16 rounded-full bg-warning/10 text-warning flex items-center justify-center mb-2">
              <FiAlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="card-title text-xl font-bold">Account Pending Activation</h2>
            
            <div className="alert alert-warning text-left text-xs my-2">
              <span>Welcome, <strong>{user?.name}</strong> ({user?.email}). Your account is currently inactive.</span>
            </div>

            <p className="text-xs opacity-70 mb-4">
              Please contact a <strong>Basa Sajai Admin</strong> to activate your access and assign your role.
            </p>

            <button onClick={() => signOut()} className="btn btn-ghost btn-block gap-2">
              <FiLogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}