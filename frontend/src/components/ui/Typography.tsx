import * as React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import { cn } from '../../lib/utils';

export function Typography({ className, ...props }: React.ComponentProps<typeof MuiTypography>) {
  return <MuiTypography className={cn(className)} {...props} />;
}
