"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Layers, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import api from '@/app/utils/axiosInstance'
import Link from 'next/link'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    profilePicture: 'noimage.png'
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  // Handle step 1 - Send verification code
  const handleSendCode = async () => {
    if (!formData.email) {
      toast.error('Email is required')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/send-verification', { email: formData.email })
      setStep(2)
      toast.success('Verification code sent to your email')
    } catch (error) {
      toast.error('Failed to send verification code')
    } finally {
      setLoading(false)
    }
  }

  // Handle step 2 - Verify code
  const handleVerifyCode = async () => {
    if (!formData.code) {
      toast.error('Verification code is required')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/auth/verifycode', {
        email: formData.email,
        code: formData.code
      })
      
      if (response.data.message === "Verification succesfull") {
        toast.success('Email verified successfully')
        setTimeout(() => setStep(3), 3000)
      }
    } catch (error) {
      toast.error('Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  // Handle step 3 - Complete registration
  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/signUp', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        code:formData.code,
        role: formData.role,
        profilePicture: formData.profilePicture
      })
      toast.success('Account created successfully!')
      router.push('/signIn')
    } catch (error) {
      toast.error('Failed to create account')
    } finally {
      setLoading(false)
    }
  }

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
              <h1 className="text-2xl font-semibold tracking-tight">
                {step === 1 ? 'Create an account' : step === 2 ? 'Verify your email' : 'Complete your profile'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {step === 1 ? 'Enter your email to get started' : 
                 step === 2 ? 'Enter the verification code sent to your email' : 
                 'Enter your information to complete registration'}
              </p>
            </div>

            {/* Step 1: Email Verification */}
            {step === 1 && (
              <div className="grid gap-6">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="name@gmail.com"
                    required
                  />
                </div>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600" 
                  onClick={handleSendCode}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Continue'}
                </Button>
              </div>
            )}

            {/* Step 2: Code Verification */}
            {step === 2 && (
              <div className="grid gap-6">
                <div className="grid gap-1">
                  <Label>Email</Label>
                  <Input
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="Enter 6-digit code"
                    required
                  />
                </div>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600" 
                  onClick={handleVerifyCode}
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>
              </div>
            )}

            {/* Step 3: Complete Registration */}
            {step === 3 && (
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="John"
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label>Email</Label>
                  <Input
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
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
                <div className="grid gap-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <Button 
                  className="bg-emerald-500 hover:bg-emerald-600"
                  onClick={handleSignup}
                  disabled={loading || formData.password !== formData.confirmPassword}
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </div>
            )}

            <Separator />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/signIn" className="underline text-emerald-500 hover:text-emerald-600">
                Sign in
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
    </div>
  )
}