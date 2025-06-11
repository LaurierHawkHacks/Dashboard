import "firebase-admin/auth";

declare module "firebase-admin/auth" {
	interface DecodedIdToken {
		admin?: boolean;
		email?: string;
	}
}
