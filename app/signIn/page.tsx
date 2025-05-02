"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layers, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import api from '@/app/utils/axiosInstance'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [showResetDialog, setShowResetDialog] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }
  
    setLoading(true);
    try {
      const response = await api.post('/auth/signIn', formData);
      if (response.data) {
        const { token, user } = await response.data 
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=strict`;
        localStorage.setItem('userId', response.data.user.id);
  
        switch(response.data.user.role) {
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          case 'TEACHER':
            router.push('/dashboard/teacher');
            break;
          case 'STUDENT':
          default:
            router.push('/dashboard/student');
            break;
        }
  
        toast.success('Login successful');
      }
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const initiatePasswordReset = () => {
    if (!formData.email) {
      toast.error('Please enter your email address first');
      return;
    }
    setShowResetDialog(true);
  };

  const handleForgotPassword = async () => {
    setIsResettingPassword(true);
    try {
      const response = await api.post('/auth/send-password-reset-email', {
        email: formData.email
      });
      
      if (response.data.success) {
        toast.success(`Password reset link sent to ${formData.email}`);
      } else {
        toast.error(response.data.message || 'Failed to send reset email');
      }
    } catch (error) {
      toast.error('Error sending password reset email');
      console.error('Password reset error:', error);
    } finally {
      setIsResettingPassword(false);
      setShowResetDialog(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container flex flex-1 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Side - Branding */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-emerald-600" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Layers className="mr-2 h-6 w-6" />
            Atlas Learning
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Atlas has completely transformed how I approach learning new skills. The courses are engaging and the
                community is incredibly supportive."
              </p>
              <footer className="text-sm">Sarah Johnson</footer>
            </blockquote>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="grid gap-1">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button 
                    type="button" 
                    onClick={initiatePasswordReset}
                    className="text-sm text-emerald-500 hover:text-emerald-600 hover:underline"
                    disabled={isResettingPassword}
                  >
                    {isResettingPassword ? 'Sending...' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <Button 
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </div>

            <Separator />
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/signUp" className="underline text-emerald-500 hover:text-emerald-600">
                Sign up
              </Link>
            </div>
            <div className="mt-auto">
              <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-emerald-600">Reset Password</DialogTitle>
            <DialogDescription className="text-gray-600">
              A password reset link will be sent to:
              <span className="font-medium text-emerald-600 block mt-1">{formData.email}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-sm text-gray-500">
              Click "Confirm" to receive instructions for resetting your password.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              onClick={handleForgotPassword}
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={isResettingPassword}
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}