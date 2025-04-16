export interface ClosableDrawerProps {
    open: boolean;
    title: string;
    children: React.ReactNode;
    container: HTMLElement | null;
    onSearch: (keyword: string) => void;
    onClose: () => void;
}

export interface HeaderProps {
    handleDrawerToggle: (
        e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>
    ) => void;
}

export interface HeaderMenusProps {
    handleDrawerToggle: (
        e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLDivElement>
    ) => void;
}

