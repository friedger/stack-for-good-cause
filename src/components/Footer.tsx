import { GitBranch } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
    return (
        < footer className="container mx-auto px-6 py-8 border-t border-border" >
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
                <Logo size="sm" />
                <div className="text-sm">
                    <a href="https://github.com/friedger/stack-for-good-cause/issues"
                        className="flex items-center hover:text-blue-400 transition-colors">
                        <GitBranch className="h-4 w-4 mr-1" />
                        Help improve the site
                    </a>
                </div>
                <div className="text-sm">
                    © 2025 Fast Pool. Built on Stacks blockchain.
                </div>
            </div>
        </footer >
    );
}

export default Footer;