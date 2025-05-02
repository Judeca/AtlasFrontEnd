import { Suspense } from 'react';
import ResetPasswordClient from './resetPassword';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}