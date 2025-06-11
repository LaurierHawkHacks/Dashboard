import { useEffect, useState } from "react";

export function useDocumentVisibility() {
	const [isDocumentVisible, setIsDocumentVisible] = useState(!document.hidden);

	useEffect(() => {
		function handleVisibilityChange() {
			setIsDocumentVisible(!document.hidden);
		}

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);

	return isDocumentVisible;
}
