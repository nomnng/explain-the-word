"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{ href: "/", label: "Home" },
	{ href: "/play", label: "Play" },
] as const;

function isActive(pathname: string, href: string) {
	if (href === "/") {
		return pathname === "/";
	}

	return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavBar() {
	const pathname = usePathname();

	return (
		<nav className="border-b-3 border-foreground/90 bg-primary">
			<div className="mx-auto flex flex-wrap items-center justify-start gap-4 px-6 py-4">
				<Link
					href="/"
					className="text-sm font-semibold uppercase tracking-widest hover:opacity-80"
				>
					Explain the Word
				</Link>

				<ul className="flex flex-1 justify-center gap-2">
					{links.map((link) => {
						const active = isActive(pathname, link.href);

						return (
							<li key={link.href}>
								<Link
									href={link.href}
									className={`rounded-full px-4 py-2 text-sm transition-opacity ${
										active
											? "bg-foreground text-black"
											: "hover:bg-foreground/10 border"
									}`}
									aria-current={active ? "page" : undefined}
								>
									{link.label}
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
}
