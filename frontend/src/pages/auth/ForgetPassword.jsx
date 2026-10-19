import { Link, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";

import { Button, Card, Input } from "../../components/common";
import { forgotPassword, resetPassword } from "../../services/authService";

function ForgetPassword() {
    const { token } = useParams();
    const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const newPassword = useWatch({ control, name: "password" });

    const onSubmit = async (data) => {
        try {
            if (token) {
                await resetPassword(token, data.password);
                toast.success("Password reset successfully.");
                window.location.assign("/login");
            } else {
                await forgotPassword(data.email);
                toast.success("If an account exists, a reset link has been sent.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to process your request.");
        }
    };

    return (
        <div className="forget-password-page text-center">
            <Card className="forget-password-card">
                <h2>{token ? "Reset Password" : "Forgot Password"}</h2>
                <p>
                    {token
                        ? "Choose a new password for your account."
                        : "Enter your email to receive a password reset link."}
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {!token && (
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" }
                            })}
                        />
                    )}
                    {token && (
                        <>
                            <Input
                                label="New Password"
                                type="password"
                                placeholder="Enter your new password"
                                error={errors.password?.message}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Password must be at least 8 characters" }
                                })}
                            />
                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Confirm your new password"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) => value === newPassword || "Passwords do not match"
                                })}
                            />
                        </>
                    )}
                    <Button type="submit" fullWidth loading={isSubmitting}>
                        {token ? "Change Password" : "Send Reset Link"}
                    </Button>
                </form>
                <p className="mt-3 mb-0">
                    <Link to="/login">Back to Login</Link>
                </p>
            </Card>
        </div>
    );
}

export default ForgetPassword;
