import { Button } from "@/components/ui/button";
import { UserCheck, X } from "lucide-react";
import { useSourceTracking } from "@/hooks/useSourceTracking";

const ReferralSource = () => {
    const { currentSource, clearSource } = useSourceTracking();
    console.log("ReferralSource currentSource:", currentSource);
    return <>{
        currentSource && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 my-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <UserCheck className="h-4 w-4 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-medium text-sm mb-1">
                                Referred by: {currentSource.toUpperCase()}
                            </h3>
                            <p className="text-gray-400 text-xs">
                                This referral will be credited when you stack.
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSource}
                        className="text-gray-400 hover:text-white hover:bg-red-500/20 h-8 w-8 p-0"
                        title="Remove referral"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        )
    }
    </>
}
export default ReferralSource;