import Logo from "./Logo";

/** Split auth screen: artwork + promise on the left, form on the right. */
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className="min-h-screen grid lg:grid-cols-2" data-theme="night">
    <section
      className="relative hidden lg:flex flex-col justify-between p-10 text-white"
      style={{ backgroundImage: "url('/2.png')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
      <div className="relative">
        <Logo size="lg" />
      </div>
      <div className="relative max-w-md">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          Practise a language with a real person, not a flashcard.
        </h2>
        <p className="mt-4 text-white/80">
          Find partners who speak what you're learning, chat, and jump on a video call when you're ready.
        </p>
      </div>
    </section>

    <section className="flex items-center justify-center p-6 sm:p-10">
      <div className="w-full max-w-sm">
        <div className="lg:hidden mb-8">
          <Logo size="lg" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-base-content/60 mt-1">{subtitle}</p>}
        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6 text-sm text-center text-base-content/70">{footer}</div>}
      </div>
    </section>
  </div>
);

export default AuthLayout;
