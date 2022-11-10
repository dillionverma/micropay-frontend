import { SvgIcon } from "@mui/material";
import CashappSVG from "./cashapp.svg";
import LightningSVG from "./lightning.svg";
import StrikeSVG from "./strike.svg";

export const StrikeIcon = (props) => {
  return (
    <SvgIcon>
      <StrikeSVG />
    </SvgIcon>
  );
};

export const CashappIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <CashappSVG />
    </SvgIcon>
  );
};

// LightningIcon
export const LightningIcon = (props) => {
  return (
    <SvgIcon {...props}>
      <LightningSVG />
    </SvgIcon>
  );
};
