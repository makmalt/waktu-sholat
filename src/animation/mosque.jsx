"use client"; 
import Lottie from "lottie-react";
import mosque from "../app/mosque.json";

export const Mosque = () => { 
    return <Lottie animationData={mosque} loop={true} />;
}