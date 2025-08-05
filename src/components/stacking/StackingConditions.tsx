import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, FileText, Search } from "lucide-react";

interface StackingConditionsProps {
    accepted: boolean;
    onAcceptedChange: (accepted: boolean) => void;
    disabled?: boolean;
}

const StackingConditions = ({
    accepted,
    onAcceptedChange,
    disabled = false
}: StackingConditionsProps) => {

    return (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center text-lg">
                    Fast Pool Conditions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <AlertTriangle className="h-4 w-4 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-medium text-sm mb-1">
                                This transaction can't be reversed
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Your STX will stay locked for the full duration of the pool's commitment.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <Search className="h-4 w-4 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-medium text-sm mb-1">
                                Rewards are not guaranteed
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Stacking rewards depends on Stacks mining, network performance
                                and the pool operator.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-blue-400" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-medium text-sm mb-1">
                                Stacking with the pool's contract
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                The pool's smart contract manages Stacking and using it means agreeing to its terms.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="accept-conditions"
                            checked={accepted}
                            onCheckedChange={onAcceptedChange}
                            disabled={disabled}
                            className="mt-0.5 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                        />
                        <label
                            htmlFor="accept-conditions"
                            className="text-white text-sm font-medium cursor-pointer leading-relaxed"
                        >
                            I understand and accept these Fast Pool conditions
                        </label>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StackingConditions;
