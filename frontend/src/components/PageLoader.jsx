import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div className="min-h-screen grid place-items-center" data-theme={theme}>
      <span className="loading loading-dots loading-lg text-primary" />
    </div>
  );
};

export default PageLoader;
