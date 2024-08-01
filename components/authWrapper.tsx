"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
	const ComponentWithAuth = (props: any) => {
		const { isAuthenticated } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (typeof window !== "undefined" && !isAuthenticated) {
				router.replace("/");
			}
		}, [isAuthenticated, router]);

		if (!isAuthenticated) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};

	return ComponentWithAuth;
};

export default withAuth;
