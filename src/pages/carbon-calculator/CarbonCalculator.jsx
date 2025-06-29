import React from "react";
import { PlusIcon } from "lucide-react";
import Tab from "../../components/ui/Tab";
import { Button, IconButton } from "@/components/ui/Button";
import ActiveCalculation from "./ActiveCalculation";
import SavedDrafts from "./SavedDrafts";
import useBooleanSelector from "@/hooks/useBooleanSelector";

// const Models = () => {
  

  

//   const ModelBtn = ({ Model, children }) => (
//     <Button variant="secondary" onClick={() => showModel(<Model />)}>{children}</Button>
//   );

//   return (
//     <>
//       <Overlay ref={overlayRef} />
//       <div className="p-6 w-full gap-2 flex">
//         <ModelBtn Model={EnergyModel}>Energy</ModelBtn>
//         <ModelBtn Model={TranspotationModel}>Transpotation</ModelBtn>
//         <ModelBtn Model={ResourceConsumptionModel}>Resource Consumption</ModelBtn>
//       </div>
//     </>
//   );
// };

function CarbonCalculator() {
  const [active, drafts, setTab, selectedTab] = useBooleanSelector(
    2,
    1
  );

  const addBehaviour = (n) => {
    return { onClick: () => setTab(n), active: selectedTab == n };
  };

  return (
    <>
      <div className="self-stretch px-6 bg-base-background border-b border-base-border inline-flex justify-start items-center gap-6">
        <div className="flex-1 flex justify-start items-center gap-2">
          <Tab title="Active Calculation" {...addBehaviour(1)} />
          <Tab title="Saved Drafts" count={3} {...addBehaviour(2)} />
          {/* <Tab title="Models" {...addBehaviour(3)} /> */}
        </div>
        {/* <IconButton Icon={PlusIcon} variant="defaultOutlined">
          New Calculation
        </IconButton> */}
      </div>
      {active && <ActiveCalculation />}
      {drafts && <SavedDrafts />}
      {/* {models && <Models />} */}
      <div className="w-full max-w-[1280px] p-6 inline-flex justify-end items-start gap-4">
        <Button variant="secondaryOutlined">Save for Later</Button>
        <Button>Generate Intelligence Report</Button>
      </div>
    </>
  );
}

export default CarbonCalculator;
