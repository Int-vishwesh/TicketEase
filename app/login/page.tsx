import Image from "next/image"
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-5 p-6 md:p-10">
        
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center text-xl gap-2 font-medium">
            <Image src="Icon-black.png" width={32} height={32} alt="logo"
              className="flex h-6 w-6 items-center justify-center rounded-md ">
            </Image>
            TicketEase
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

      <div className="relative hidden bg-muted lg:block">
        <img
          src="login-bot.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
