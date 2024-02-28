import { WingLogo } from './WingLogo'
import classNames from "classnames";
import { Chat } from './chat'
import { TerraformFiles } from './terraform'

function App() {

  return (
    <div className='p-6 h-full'>
      <div
      className={classNames(
        "flex items-center font-sans font-normal text-[#1c1e21] dark:text-[#2bd5c1]",
        "h-[80px] w-full",
      )}
    >
      <a
        href="https://winglang.io/"
        rel="noreferrer"
        className={classNames(
          "hover:text-slate-600 dark:hover:text-white mr-[16px] decoration-0",
        )}
      >
        <WingLogo className="h-[24px] w-[88px]" />
      </a>
      </div>
          <div className='flex gap-4 h-full'>
      <Chat />
      <TerraformFiles />
    </div>
    </div>
  )
}

export default App
