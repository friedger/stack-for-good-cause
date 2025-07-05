const FastPoolBenefits = () => {
    return (
        <div className="border-t border-white/10 pt-4">
            <h4 className="text-white font-semibold mb-2">Fast Pool Benefits</h4>
            <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    Non-Custodial Stacking
                </li>
                <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    Full Transparency
                </li>
                <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    Choose STX or sBTC rewards
                </li>
                <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    Optional social impact
                </li>
            </ul>
        </div>
    )
}

export default FastPoolBenefits;