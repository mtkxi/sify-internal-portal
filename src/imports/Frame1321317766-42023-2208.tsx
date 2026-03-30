import svgPaths from "./svg-7x1n71kmmz";

function Frame11() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[234px]">
      <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[30px] not-italic relative shrink-0 text-[#1e2122] text-[20px] text-nowrap tracking-[0.48px] whitespace-pre">Add VAS</p>
    </div>
  );
}

function IconUiIcons() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/UI icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/UI icons">
          <path d="M17 7L7 17M7 7L17 17" id="Icon" stroke="var(--stroke-0, #585E61)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className="bg-white h-[64px] relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[64px] items-center justify-between px-[24px] py-[16px] relative w-full">
          <Frame11 />
          <IconUiIcons />
        </div>
      </div>
    </div>
  );
}

function IconUiIcons1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon/UI icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon/UI icons">
          <path d={svgPaths.p14c24280} fill="var(--fill-0, #37B8A4)" id="Subtract" />
        </g>
      </svg>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[483px]">
      <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[#1e2122] text-[15px] text-nowrap tracking-[0.27px] whitespace-pre">Additional IP</p>
      <IconUiIcons1 />
    </div>
  );
}

function IconNavigationIcons() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Navigation icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Navigation icons">
          <path d="M18 15L12 9L6 15" id="Icon" stroke="var(--stroke-0, #585E61)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white h-[54px] relative rounded-tl-[6px] rounded-tr-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[6px] rounded-tr-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[54px] items-center justify-between px-[24px] py-[14px] relative w-full">
          <Frame39 />
          <IconNavigationIcons />
        </div>
      </div>
    </div>
  );
}

function Lables() {
  return (
    <div className="h-[20px] relative shrink-0 w-[31px]" data-name="Lables">
      <p className="absolute bottom-0 font-['Myriad_Pro:Regular',sans-serif] leading-[19.5px] left-0 not-italic right-[-54.84%] text-[#1e2122] text-[13px] text-nowrap top-0 tracking-[0.2028px] whitespace-pre">
        <span>{`IP Type `}</span>
        <span className="text-[#f56975]">*</span>
      </p>
    </div>
  );
}

function IconFieldIcons() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Field icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Field icons">
          <path d="M6 9L12 15L18 9" id="Icon" stroke="var(--stroke-0, #1E2122)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#f7f9fa] h-[40px] relative rounded-[6px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[10px] py-0 relative w-full">
          <p className="font-['Myriad_Pro:Regular',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap tracking-[0.2028px] whitespace-pre">Static IPV4/32</p>
          <IconFieldIcons />
        </div>
      </div>
    </div>
  );
}

function TextField() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[196px]" data-name="Text field">
      <Lables />
      <Frame2 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="bg-white relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start justify-between p-[24px] relative w-full">
          <TextField />
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[935px]">
      <Frame6 />
      <Frame29 />
    </div>
  );
}

function IconUiIcons2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon/UI icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon/UI icons">
          <path d={svgPaths.p14c24280} fill="var(--fill-0, #37B8A4)" id="Subtract" />
        </g>
      </svg>
    </div>
  );
}

function Frame40() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[459px]">
      <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[#1e2122] text-[15px] text-nowrap tracking-[0.27px] whitespace-pre">Managed Services</p>
      <IconUiIcons2 />
    </div>
  );
}

function IconNavigationIcons1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Navigation icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Navigation icons">
          <path d="M18 15L12 9L6 15" id="Icon" stroke="var(--stroke-0, #585E61)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-white h-[54px] relative rounded-tl-[6px] rounded-tr-[6px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[54px] items-center justify-between px-[24px] py-[14px] relative w-full">
          <Frame40 />
          <IconNavigationIcons1 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[4px] items-center justify-center px-[24px] py-[10px] relative shrink-0 w-[120px]">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap tracking-[0.2028px] whitespace-pre">SELECT</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative shrink-0">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[1px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center px-[16px] py-[10px] relative w-full">
          <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#1e2122] text-[13px] tracking-[0.2028px] w-[74px]">SERVICE</p>
        </div>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative shrink-0">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[1px_0px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center px-[16px] py-[10px] relative w-full">
          <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap tracking-[0.2028px] whitespace-pre">DESCRIPTION</p>
        </div>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[935px]">
      <Frame14 />
      <Frame23 />
      <Frame13 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute left-1/2 size-[18px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <div className="absolute inset-0" style={{ "--fill-0": "rgba(14, 51, 70, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <g id="Frame 37607">
            <rect fill="var(--fill-0, #0E3346)" height="18" rx="2" width="18" />
            <path d="M5 9L8 12L14 6" id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CheckBox() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Check Box">
      <Frame4 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[64px] items-center justify-center px-[16px] py-[14px] relative shrink-0 w-[120px]">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <CheckBox />
    </div>
  );
}

function Frame20() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative shrink-0">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[16px] py-[14px] relative size-full">
          <p className="font-['Myriad_Pro:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1e2122] text-[13px] w-[180px]">Managed Router</p>
        </div>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="basis-0 bg-white grow h-[64px] min-h-px min-w-px relative shrink-0">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[64px] items-center px-[16px] py-[14px] relative w-full">
          <p className="basis-0 font-['Myriad_Pro:Regular',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#1e2122] text-[13px]">Placeholder Description</p>
        </div>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[935px]">
      <Frame />
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <Frame20 />
      </div>
      <Frame24 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute left-1/2 size-[18px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
      <div className="absolute inset-0" style={{ "--fill-0": "rgba(14, 51, 70, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <g id="Frame 37607">
            <rect fill="var(--fill-0, #0E3346)" height="18" rx="2" width="18" />
            <path d="M5 9L8 12L14 6" id="Icon" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CheckBox1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Check Box">
      <Frame5 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] h-[64px] items-center justify-center px-[16px] py-[14px] relative rounded-bl-[6px] shrink-0 w-[120px]">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-bl-[6px]" />
      <CheckBox1 />
    </div>
  );
}

function Frame21() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative shrink-0">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] items-center px-[16px] py-[14px] relative size-full">
          <p className="font-['Myriad_Pro:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1e2122] text-[13px] w-[180px]">Managed Firewall</p>
        </div>
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="basis-0 bg-white grow h-[64px] min-h-px min-w-px relative shrink-0">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[64px] items-center px-[16px] py-[14px] relative w-full">
          <p className="basis-0 font-['Myriad_Pro:Regular',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#1e2122] text-[13px]">Placeholder Description</p>
        </div>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[935px]">
      <Frame1 />
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <Frame21 />
      </div>
      <Frame25 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex flex-col items-start relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full">
      <Frame19 />
      <Frame22 />
      <Frame26 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative rounded-[6px] shrink-0 w-[935px]">
      <Frame7 />
      <Frame27 />
    </div>
  );
}

function IconUiIcons3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon/UI icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon/UI icons">
          <path d={svgPaths.p14c24280} fill="var(--fill-0, #37B8A4)" id="Subtract" />
        </g>
      </svg>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[459.5px]">
      <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[#1e2122] text-[15px] text-nowrap tracking-[0.27px] whitespace-pre">Devices</p>
      <IconUiIcons3 />
    </div>
  );
}

function IconNavigationIcons2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Navigation icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Navigation icons">
          <path d="M18 15L12 9L6 15" id="Icon" stroke="var(--stroke-0, #585E61)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-white h-[54px] relative rounded-tl-[6px] rounded-tr-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[6px] rounded-tr-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[54px] items-center justify-between px-[24px] py-[14px] relative w-full">
          <Frame42 />
          <IconNavigationIcons2 />
        </div>
      </div>
    </div>
  );
}

function RadioButton() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Radio Button">
      <div className="absolute bg-[#0e3346] left-1/2 rounded-[999px] size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Checkbox" />
      <div className="absolute bg-white left-1/2 rounded-[999px] size-[8px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Checkbox" />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Myriad_Pro:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap whitespace-pre">Catalyst 9400/9500 Series</p>
      <RadioButton />
    </div>
  );
}

function Frame37() {
  return (
    <div className="bg-[#f7f9fa] box-border content-stretch flex flex-col gap-[8px] items-start justify-center pl-[20px] pr-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[224px]">
      <Frame15 />
    </div>
  );
}

function RadioButton1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Radio Button">
      <div className="absolute bg-[#f7f9fa] left-1/2 rounded-[999px] size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Checkbox">
        <div aria-hidden="true" className="absolute border border-[#0e3346] border-solid inset-0 pointer-events-none rounded-[999px]" />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Myriad_Pro:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap whitespace-pre">Aruba CX 6300/6400 Series</p>
      <RadioButton1 />
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-[#f7f9fa] box-border content-stretch flex flex-col gap-[8px] items-start justify-center pl-[20px] pr-[16px] py-[12px] relative rounded-[8px] shrink-0 w-[224px]">
      <Frame16 />
    </div>
  );
}

function RadioButton2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Radio Button">
      <div className="absolute bg-[#f7f9fa] left-1/2 rounded-[999px] size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="Checkbox">
        <div aria-hidden="true" className="absolute border border-[#0e3346] border-solid inset-0 pointer-events-none rounded-[999px]" />
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <p className="font-['Myriad_Pro:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap whitespace-pre">None</p>
      <RadioButton2 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="bg-[#f7f9fa] box-border content-stretch flex flex-col gap-[10px] items-start justify-center px-[20px] py-[12px] relative rounded-[8px] shrink-0">
      <Frame17 />
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame37 />
      <Frame41 />
      <Frame43 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0">
      <Frame46 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="content-stretch flex gap-[200px] items-start relative shrink-0">
      <Frame12 />
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <p className="font-['Myriad_Pro:Regular',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap tracking-[0.2028px] whitespace-pre">Select Switch Model</p>
      <Frame48 />
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <Frame47 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="bg-white relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[24px] relative w-full">
          <Frame49 />
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[935px]">
      <Frame8 />
      <Frame30 />
    </div>
  );
}

function IconUiIcons4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon/UI icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon/UI icons">
          <path d={svgPaths.p14c24280} fill="var(--fill-0, #37B8A4)" id="Subtract" />
        </g>
      </svg>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[459.5px]">
      <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[22.5px] not-italic relative shrink-0 text-[#1e2122] text-[15px] text-nowrap tracking-[0.27px] whitespace-pre">DDOS</p>
      <IconUiIcons4 />
    </div>
  );
}

function IconNavigationIcons3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Navigation icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Navigation icons">
          <path d="M18 15L12 9L6 15" id="Icon" stroke="var(--stroke-0, #585E61)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-white h-[54px] relative rounded-tl-[6px] rounded-tr-[6px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border-[#e9ebec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[6px] rounded-tr-[6px]" />
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[54px] items-center justify-between px-[24px] py-[14px] relative w-full">
          <Frame44 />
          <IconNavigationIcons3 />
        </div>
      </div>
    </div>
  );
}

function Lables1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[31px]" data-name="Lables">
      <p className="absolute bottom-0 font-['Myriad_Pro:Regular',sans-serif] leading-[19.5px] left-0 not-italic right-[-280.65%] text-[#1e2122] text-[13px] text-nowrap top-0 tracking-[0.2028px] whitespace-pre">
        <span>{`Mitigation Capacity `}</span>
        <span className="text-[#f56975]">*</span>
      </p>
    </div>
  );
}

function IconFieldIcons1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon/Field icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon/Field icons">
          <path d="M6 9L12 15L18 9" id="Icon" stroke="var(--stroke-0, #1E2122)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#f7f9fa] h-[40px] relative rounded-[6px] shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[40px] items-center justify-between px-[10px] py-0 relative w-full">
          <p className="font-['Myriad_Pro:Regular',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap tracking-[0.2028px] whitespace-pre">10 Gbps</p>
          <IconFieldIcons1 />
        </div>
      </div>
    </div>
  );
}

function TextField1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[196px]" data-name="Text field">
      <Lables1 />
      <Frame3 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-white relative rounded-bl-[6px] rounded-br-[6px] shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start justify-between p-[24px] relative w-full">
          <TextField1 />
        </div>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[935px]">
      <Frame9 />
      <Frame31 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0">
      <Frame32 />
      <Frame34 />
      <Frame35 />
      <Frame33 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[40px] items-center pb-0 pt-[24px] px-[24px] relative shrink-0">
      <Frame36 />
    </div>
  );
}

function Button() {
  return (
    <div className="h-[40px] relative rounded-[6px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#1e2122] border-solid inset-[-1px] pointer-events-none rounded-[7px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="box-border content-stretch flex gap-[60px] h-[40px] items-center justify-center p-[24px] relative">
          <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[19px] not-italic relative shrink-0 text-[#1e2122] text-[13px] text-nowrap tracking-[0.5px] whitespace-pre">Cancel</p>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#0e3346] box-border content-stretch flex gap-[60px] h-[40px] items-center justify-center px-[24px] py-0 relative rounded-[6px] shrink-0 w-[120px]" data-name="Button">
      <p className="font-['Myriad_Pro:Semibold',sans-serif] leading-[19px] not-italic relative shrink-0 text-[#f7f9fa] text-[13px] text-nowrap tracking-[0.5px] whitespace-pre">Save</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start justify-between p-[24px] relative w-full">
          <Button />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <Frame38 />
      <Frame28 />
    </div>
  );
}

export default function Frame18() {
  return (
    <div className="bg-[#f7f9fa] content-stretch flex flex-col items-center relative size-full">
      <Frame10 />
      <Frame45 />
    </div>
  );
}