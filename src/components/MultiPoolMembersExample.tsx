import React, { useEffect, useState } from 'react';
import { useMultiPoolMembers } from '../hooks/useMPMembers';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export const MultiPoolMembersExample: React.FC = () => {
  const {
    users,
    fetchMultiPoolMembers,
    isWritingToSupabase,
    supabaseError,
    isSupabaseConfigured,
  } = useMultiPoolMembers();

  const [isLoading, setIsLoading] = useState(false);

  const handleFetchData = async () => {
    setIsLoading(true);
    try {
      await fetchMultiPoolMembers();
    } catch (error) {
      console.error('Error fetching pool members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Multi-Pool Members Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Configuration Status */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isSupabaseConfigured ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span className="text-sm">
              Supabase: {isSupabaseConfigured ? 'Configured' : 'Not Configured'}
            </span>
          </div>

          {/* Error Display */}
          {supabaseError && (
            <Alert variant="destructive">
              <AlertDescription>
                Supabase Error: {supabaseError}
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button
            onClick={handleFetchData}
            disabled={isLoading || isWritingToSupabase}
            className="w-full"
          >
            {isLoading
              ? 'Fetching from Blockchain...'
              : isWritingToSupabase
              ? 'Writing to Supabase...'
              : 'Fetch Latest Pool Members'}
          </Button>

          {/* Data Display */}
          {users && users.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                Found {users.length} Pool Members
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {users.map((user: any, index: number) => (
                  <Card key={user.pool_member_id || index} className="p-3">
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>ID:</strong> {user.pool_member_id}
                      </div>
                      <div>
                        <strong>Currency:</strong> {user.currency}
                      </div>
                      <div>
                        <strong>Value:</strong> {user.v_value}
                      </div>
                      <div>
                        <strong>Block Height:</strong> {user.block_height}
                      </div>
                      <div>
                        <strong>TX ID:</strong> {user.tx_id}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Data Message */}
          {users && users.length === 0 && (
            <Alert>
              <AlertDescription>
                No new pool member events found.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
