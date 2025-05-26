'use server'

import { auth, db } from "@/firebase/admin"

import { cookies } from "next/headers"

const ONE_WEEK=24*60*60*7

export  async function signUp(params:SignUpParams){
    const {email,name,uid}=params
    try {
        const userRecord=await db.collection('users').doc(uid).get()
        if(userRecord.exists){
            return {
                success:false,
                message:'User already exists. Signin instead'
            }
        }
        await db.collection('users').doc(uid).set({
            name,email
        })
        return {
            success:true,
            message:'Signup Successful.Please Signin to continue'
        }
    } catch (error:any) {
        console.error('Signup Error: ',error)
        if(error.code==='auth/email already exists'){
            return {
                success:false,
                message:'This email is already in use'
            }
        }
        return {
            success:false,
            message:'Failed to create an user'
        }
    }
}

export async function signIn(params:SignInParams){
    const {idToken,email}=params
    try {
        const userRecord=await auth.getUserByEmail(email)
        if(!userRecord){
            return {
                success:false,
                message:`User doesn't exist. Please Signup.`
            }
        }
        await SetSessionCookie(idToken)
        return {
            success:true,
            message:"Signin successful"
        }
    } catch (error:any) {
        console.log(`Signin error: ${error}`)
        return {
            success:false,
            message:error.code
        }
    }
}
export async function SetSessionCookie(idToken:string){
    const cookieStore=await cookies()
    const sessionCookie=await auth.createSessionCookie(idToken,{
        expiresIn:ONE_WEEK*100
    })

    cookieStore.set('session',sessionCookie,{
        maxAge:ONE_WEEK,
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        path:'/',
        sameSite:'lax'
    })
}

export async function getCurrentUser():Promise<User | null>{
    const cookieStore=await cookies()
    const sessionCookie=cookieStore.get('session')?.value
    if(!sessionCookie) return null
    try {
        const decodedClaims=await auth.verifySessionCookie(sessionCookie,true)
        const userRecord=await db.collection('users').doc(decodedClaims.uid).get()
        if(!userRecord.exists) return null
        return {
            ...userRecord.data(),
            id:userRecord.id
        } as User
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function isAuthenticated():Promise<boolean> {
    const user=await getCurrentUser()
    return !!user
}