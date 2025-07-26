'use client';

import { ApolloError } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Wifi, RefreshCw, AlertCircle } from "lucide-react";

interface GraphQLErrorProps {
  error: ApolloError;
  onRetry?: () => void;
  className?: string;
}

export function GraphQLError({ error, onRetry, className }: GraphQLErrorProps) {
  const getErrorType = () => {
    if (error.networkError) {
      return {
        type: 'network',
        icon: Wifi,
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
      };
    }

    if (error.graphQLErrors?.length > 0) {
      const graphQLError = error.graphQLErrors[0];
      return {
        type: 'graphql',
        icon: AlertCircle,
        title: 'Data Error',
        message: graphQLError.message,
      };
    }

    return {
      type: 'unknown',
      icon: AlertTriangle,
      title: 'Unexpected Error',
      message: 'An unexpected error occurred. Please try again.',
    };
  };

  const errorInfo = getErrorType();
  const Icon = errorInfo.icon;

  return (
    <Card className={`border-red-200 ${className}`}>
      <CardHeader>
        <CardTitle className="text-red-700 flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {errorInfo.title}
        </CardTitle>
        <CardDescription className="text-red-600">
          {errorInfo.message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Development Error Details */}
        {process.env.NODE_ENV === 'development' && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium">
                  Developer Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {/* Retry Button */}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
