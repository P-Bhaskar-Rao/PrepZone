"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.actions";


const authFormSchema=(type:FormType)=>{
  return z.object({
    name:(type==='sign-up')?z.string().min(1,'Name is required').min(6,{message:'name must be 6 characters long'}):z.string().optional(),
    email:z.string().min(1,'Email required').email({message:'Enter a valid email'}),
    password:z.string().min(1,{message:'Password required'}).min(8,{message:'password must be minimum 8 characters long'})
  })
}
const AuthForm = ({type}:{type:FormType}) => {
  const router=useRouter()
  const isSign=(type==='sign-in')
  const formSchema=authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password:'',
      email:''
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    try {
      if(type==='sign-in'){
        try {
          const {email,password}=values
          const userCredentials=await signInWithEmailAndPassword(auth,email,password)
          const idToken=await userCredentials.user.getIdToken()
          if(!idToken){
            toast.error('Signin Failed')
            return
          }
          const result=await signIn({
            idToken,
            email
          })
          if(!result?.success){
            toast.error(result?.message)
            return
          }
          toast.success('Signin Successful')
          router.push('/')
        } catch (error:any) {
          console.log(`Signin error:${error}`)
          if(error.code==='auth/invalid-credential'){
            toast.error('Invalid Credentials. Check Email and Password')
          }
        }
        
      }else if(type==='sign-up'){
        const {name,email,password}=values
        try {
          const userCredentials=await createUserWithEmailAndPassword(auth,email,password)
          const result=await signUp({
            uid:userCredentials.user.uid,
            name:name!,
            email,
            password
          })
          if(!result?.success){
            toast.error(result?.message)
            return
          }
          toast.success('Signup successful. Please Signin to continue.')
          router.push('/signin')
        } catch (error:any) {
          
          if(error.code==='auth/email-already-in-use'){
            toast.error('email already in use.Signin to continue.')
          }else{
            toast.error(`Signup error:${error}`)
          }
          
        }
      }
    } catch (error:any) {
      console.log(error)
      toast.error(`There was an error:${error}`)
    }
  }
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="card flex flex-col gap-6 py-14 px-10">
        <div className="flex flex-row justify-center gap-2">
          <Image src="./logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepZone</h2>
        </div>
        <h3 className="text-center">Practice Job Interview With AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            {!isSign && <FormField name="name" placeholder="your name" control={form.control} label='Name'/>}
            <FormField name='email' placeholder="your email" control={form.control} label="Email" type="email"/>
            <FormField name="password" type="password" placeholder="your password" control={form.control} label="Password"/>
            <Button type="submit" className="btn">{isSign?'Signin':"Create An Account"}</Button>
          </form>
        </Form>
        <p className="text-center">
          {isSign?"No Account Yet?":"Have an Account Already?"}
          <Link href={isSign?'/signup':'/signin'} className="font-bold text-user-primary ml-1">{isSign?"Sign Up":"Sign In"}</Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
