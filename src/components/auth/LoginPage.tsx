import logo from '@/assets/logo.png';

const Input = ({ placeholder, type }: { placeholder: string; type: string }) => (
  <input
    className="rounded-lg bg-white/2 px-4 py-4 text-white/60 outline-none placeholder:text-white/20"
    type={type}
    placeholder={placeholder}
  />
);

const LoginPage = () => (
  <div className="bg-base flex h-screen flex-col items-center justify-center">
    <div className="flex flex-col items-center gap-y-4">
      <div className="hover:shadow-base flex w-[340px] flex-col items-center gap-y-10 rounded-lg border p-8">
        <div className="flex items-center gap-x-2">
          <img src={logo} alt="Keep logo" className="size-12" />
          <div className="text-[24px]">Zeronotes</div>
        </div>
        <form className="flex w-full flex-col gap-y-4">
          <Input placeholder="Email" type="text" />
          <Input placeholder="Password" type="password" />
        </form>
        <button className="w-full cursor-pointer rounded-lg bg-white/2 p-4 text-white/80 transition-colors duration-200 ease-in-out hover:bg-white/3">
          <span className="text-white/80">Login</span>
        </button>
      </div>
    </div>
  </div>
);

export default LoginPage;
