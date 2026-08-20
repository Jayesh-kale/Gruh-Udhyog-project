import React from 'react'
import Card from "../../components/common/Card";
import { Button, Input } from '../../components/common';
import { useForm } from 'react-hook-form';

function ForgetPassword() {

    const { register , isSubmitting, handleSubmit } = useForm();


  return (
    <div className="forget-password-page text-center">
        <Card className="forget-password-card" >
            <h2>Forget Password</h2>
            <p>Enter your email to reset your password</p>
            <form onsubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        },
                        validate: (value) => {
                            if (!value.includes("@")) {
                                return "Email must contain @";
                            }
                        }
                    }
                    )}/>
                <Button type="submit" fullWidth>
                    Reset Password
                </Button>
            </form>
        </Card>

    </div>
    
  )
}

export default ForgetPassword