import { Link, Outlet } from "@tanstack/react-router"
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import arioLogo from './assets/ar.io-white.png'
import { Toaster } from "./components/ui/toaster"
import { NetworkInfo } from "./components/NetworkInfo"
import { useNetwork } from "./hooks/useNetwork"

export const Root = () => {
  const { network } = useNetwork();

  return (
    <>
      <div className="max-h-[100vh] px-2 md:px-8 lg:px-16 py-4">
        <div>
          <CardHeader>
            <CardTitle className='flex flex-col md:flex-row px-2 items-center md:items-baseline'>
              <Link
                to={'/'}
                className='flex items-center px-1 flex-col md:flex-row gap-2 md:gap-4'
              >
                <img src={arioLogo} width='100rem' />
                <span className='font-ario text-3xl'>
                  Gateway Explorer
                </span>
              </Link>
              {
                network === "testnet" &&
                <NetworkInfo nextNetwork="devnet" />
              }
              {
                network == "devnet" &&
                <NetworkInfo nextNetwork="testnet" />
              }
            </CardTitle>
            {/* <CardDescription>List of all Gateways</CardDescription> */}
          </CardHeader>
          <CardContent>
            <Outlet />
          </CardContent>
        </div>
        <div className='flex flex-col text-center text-muted-foreground gap-1 pt-2'>
          <div className='flex flex-row flex-grow justify-center gap-2'>
            <div className='flex'>
              <a href='https://ar.io/' target='_blank' className="underline">
                Home
              </a>
            </div>
            <span className='font-bold'>•</span>
            <div className='flex'>
              <a href='https://ar.io/docs/' target='_blank' className="underline">
                Docs
              </a>
            </div>
            <span className='font-bold'>•</span>
            <div className='flex'>
              <a href='https://github.com/ar-io' target='_blank' className="underline">
                Github
              </a>
            </div>
            <span className='font-bold'>•</span>
            <div className='flex'>
              <a href='https://discord.gg/7zUPfN4D6g' target='_blank' className="underline">
                Discord
              </a>
            </div>
          </div>
          <div>
            ©2024 ar.io
          </div>
          {/* <div className={`${isDetailsSheetOpen ? 'h-[calc(50vh+3em)]' : 'h-[2em]'} transition-all duration-200`} /> */}
          <div className={`h-[2em] transition-all duration-200`} />
        </div>
      </div>
      <Toaster />
    </>
  )
}
