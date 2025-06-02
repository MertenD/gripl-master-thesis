import {JSX} from "react";

export interface BpmnToolCard {
    position: "bottom-left" | "bottom-right" | "top-right" | "right-center" | "bottom-center" | "top-center";
    content: JSX.Element;
}