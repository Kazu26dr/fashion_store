// Alert
export type AlertSeverity = "error" | "warning" | "info" | "success";
export type AlertMessage = string;

export interface AlertProps {
    severity: AlertSeverity;
    message: AlertMessage;
}

// TextDetail
export interface TextDetailProps {
    label: string;
    value: string;
}

// DeleteButton
export interface DeleteButtonProps {
    label: string;
    onClick: () => void;
}

// PrimaryButton
export interface PrimaryButtonProps {
    label: string;
    onClick: () => void;
}

// SelectBox
export interface SelectBoxProps {
    options: { id: string; name: string }[];
    value: string;
    required: boolean;
    label: string;
    select: (value: string) => void;
}


