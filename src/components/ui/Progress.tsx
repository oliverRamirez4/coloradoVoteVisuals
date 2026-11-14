'use client'
import React from "react";
import {Root, Indicator} from "@radix-ui/react-progress";
import { YES_STRONG } from "@/lib/colors";

type Props = {
    value: number
    max: number
}

function ProgressDemo (props: Props) {
	const [progress, setProgress] = React.useState(13);

	// React.useEffect(() => {
	// 	const timer = setTimeout(() => setProgress(66), 500);
	// 	return () => clearTimeout(timer);
	// }, []);

	return (
		<Root
			className="relative h-[25px] w-100% grow overflow-hidden rounded-full bg-white border-black border-2"
			style={{
				// Fix overflow clipping in Safari
				// https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
				transform: "translateZ(0)",
			}}
			value={progress}
		>
			<Indicator
				id = 'yesvotes'
				className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full transition-transform duration-[660ms]"
				style={{ transform: `translateX(-${100 - (props.value/props.max * 100)}%)`, background: YES_STRONG }}
			/>
		</Root>
	);
};


export default ProgressDemo;
