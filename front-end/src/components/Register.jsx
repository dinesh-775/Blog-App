import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router'
import * as styles from "../styles/common"

const BASE_URL = import.meta.env.VITE_API_URL

function Register() {
    const { register, handleSubmit } = useForm()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const [preview, setPreview] = useState(null)

    const onUserRegister = async (newUser) => {
        // Create form data object
        const formData = new FormData();
        //get user object
        const { role, profilePic, ...userObj } = newUser;
        
        //add all fields except profilePic to FormData object
        Object.keys(userObj).forEach((key) => {
            formData.append(key, userObj[key]);
        });
        
        // add profilePic to Formdata object
        if (profilePic && profilePic[0]) {
            formData.append("profilePic", profilePic[0]);
        }
        
        try {
            setLoading(true)
            setError(null)
            
            const endpoint = role === "author" ? "author-api" : "user-api"
            const resObj = await axios.post(`${BASE_URL}/${endpoint}/users`, formData)
            
            if (resObj.status === 201) {
                navigate("/login")
            } else {
                // Handle cases where backend returns 200/other for failure
                setError(resObj.data.error || resObj.data.message || "Registration failed")
            }
        } catch (err) {
            setError(err.response?.data.error || err.response?.data.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    //loading
    if (loading === true) {
        return <p className={styles.loadingClass}>Loading...</p>
    }

    //error
    if (error) {
        return <p className={styles.errorClass}>{error} </p>
    }

    return (
        <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Create Account</h2>

            {error && <div className={styles.errorClass + " mb-6"}>{error}</div>}

            <form onSubmit={handleSubmit(onUserRegister)}>
                {/* Role Selection */}
                <div className="flex gap-6 mb-8 justify-center bg-white p-3 rounded-xl border border-[#d2d2d7]">
                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            {...register("role")}
                            id="user"
                            value="user"
                            defaultChecked
                            className="w-4 h-4 text-[#0066cc] border-[#d2d2d7] focus:ring-[#0066cc]/10"
                        />
                        <label htmlFor="user" className="text-sm font-medium text-[#1d1d1f] cursor-pointer">User</label>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            {...register("role")}
                            id="author"
                            value="author"
                            className="w-4 h-4 text-[#0066cc] border-[#d2d2d7] focus:ring-[#0066cc]/10"
                        />
                        <label htmlFor="author" className="text-sm font-medium text-[#1d1d1f] cursor-pointer">Author</label>
                    </div>
                </div>

                {/* Inputs Grid */}
                <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                        <label className={styles.labelClass}>Username</label>
                        <input type='text' {...register("username")} placeholder='johndoe' className={styles.inputClass} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={styles.labelClass}>First Name</label>
                            <input type='text' {...register("firstname")} placeholder='John' className={styles.inputClass} />
                        </div>
                        <div>
                            <label className={styles.labelClass}>Last Name</label>
                            <input type='text' {...register("lastname")} placeholder='Doe' className={styles.inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={styles.labelClass}>Email Address</label>
                        <input type='email' {...register("email")} placeholder='name@example.com' className={styles.inputClass} />
                    </div>

                    <div>
                        <label className={styles.labelClass}>Password</label>
                        <input type='password' {...register("password")} placeholder='••••••••' className={styles.inputClass} />
                    </div>

                    <div>
                        <label className={styles.labelClass}>Upload Logo / Profile Picture</label>
<input
        type="file"
        accept="image/png, image/jpeg"
        {...register("profilePic", {
            onChange: (e) => {
                //get image file
                const file = e.target.files[0];
                // validation for image format
                if (file) {
                    if (!["image/jpeg", "image/png"].includes(file.type)) {
                        setError("Only JPG or PNG allowed");
                        return;
                    }
                    //validation for file size
                    if (file.size > 2 * 1024 * 1024) {
                        setError("File size must be less than 2MB");
                        return;
                    }
                    //Converts file → temporary browser URL(create preview URL)
                    const previewUrl = URL.createObjectURL(file);
                    setPreview(previewUrl);
                    setError(null);
                }
            }
        })} />
        {preview && (
                <div className="mt-3 flex justify-center">
                <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border"
                    />
                </div>
            )}
            </div>
            </div>  
                <button type='submit' className={styles.submitBtn}>
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className={styles.mutedText + " text-center mt-6"}>
                Already have an account? <span className={styles.linkClass + " cursor-pointer"} onClick={() => navigate('/login')}>Sign in</span>
            </p>
        </div>
    )
}

export default Register