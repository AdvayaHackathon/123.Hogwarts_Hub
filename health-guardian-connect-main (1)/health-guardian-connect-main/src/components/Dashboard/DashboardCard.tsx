
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DashboardCardProps = {
  title: string;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
  footerContent?: React.ReactNode;
  children: React.ReactNode;
};

const DashboardCard = ({
  title,
  description,
  className,
  icon,
  footerContent,
  children,
}: DashboardCardProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {icon && <div className="text-health-500">{icon}</div>}
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
      {footerContent && <CardFooter>{footerContent}</CardFooter>}
    </Card>
  );
};

export default DashboardCard;
