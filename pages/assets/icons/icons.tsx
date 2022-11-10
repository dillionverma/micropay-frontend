import { SvgIcon } from "@mui/material";
import CashappSVG from "./cashapp.svg";
import LightningSVG from "./lightning.svg";
import StrikeSVG from "./strike.svg";

export const StrikeIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      <StrikeSVG />
    </SvgIcon>
  );
};

export const CashappIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      <CashappSVG />
    </SvgIcon>
  );
};

// LightningIcon
export const LightningIcon = (props: any) => {
  return (
    <SvgIcon {...props}>
      <LightningSVG />
    </SvgIcon>
  );
};
