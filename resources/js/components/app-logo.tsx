import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-8 h-auto w-auto" />
            </div>
            <div className="ml-3 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-primary">Cahaya Anbiya</span>
                <span className="truncate text-xs text-muted-foreground">Wisata Indonesia</span>
            </div>
        </>
    );
}
