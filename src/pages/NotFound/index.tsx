import Button from "@/components/ui/Button";

function NotFoundScreen() {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-4xl font-bold">404</h1>
			<p className="text-lg">Page not found</p>
			<p className="text-lg">The page you are looking for does not exist.</p>
			<p className="text-lg">Please check the URL and try again.</p>
			<Button>
				<a href="/">Go Home</a>
			</Button>
		</div>
	);
}

export default NotFoundScreen;
