import AlertModal from "@/components/Modals/AlertModal";
import { createContext, useState, useContext } from "react";

type ModalContextType = {
	showModal: (params: {
		type: "success" | "error";
		onClose?: () => void;
		successMsg?: string;
		errorMsg?: string;
	}) => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [modalType, setModalType] = useState<"success" | "error">("error");
	const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | undefined>(undefined);
	const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

	const showModal = ({
		type,
		onClose,
		successMsg,
		errorMsg,
	}: {
		type: "success" | "error";
		onClose?: () => void;
		successMsg?: string;
		errorMsg?: string;
	}) => {
		setModalType(type);
		setSuccessMessage(successMsg);
		setErrorMessage(errorMsg);
		setOnCloseCallback(() => onClose);
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
		if (onCloseCallback) {
			onCloseCallback();
		}
		setOnCloseCallback(undefined);
		setSuccessMessage(undefined);
		setErrorMessage(undefined);
	};

	return (
		<ModalContext.Provider value={{ showModal }}>
			{children}
			<AlertModal
				type={modalType}
				isOpen={isOpen}
				onClose={closeModal}
				errorMessage={errorMessage}
				successMessage={successMessage}
			/>
		</ModalContext.Provider>
	);
}

export function useAlertModal() {
	const context = useContext(ModalContext);
	if (context === undefined) {
		throw new Error("useAlertModal must be used within a ModalProvider");
	}
	return context;
}
