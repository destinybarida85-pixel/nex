import { IconDownload } from "@/components/icons";

export default function DashboardHeader() {
  return (
    <div className="flex items-end gap-3.5 flex-wrap">
      <div>
        <h3 className="m-0 text-[22px]">Good morning, Amara</h3>
        <div className="text-muted text-[12.5px] mt-[3px]">
          Tuesday, July 21 · Here&rsquo;s where Meridian Studio stands.
        </div>
      </div>
      <div className="flex-1 hidden sm:block" />
      <div className="seg">
        <label className="seg-opt">
          <input type="radio" name="range1a" defaultChecked />
          <span>30 days</span>
        </label>
        <label className="seg-opt">
          <input type="radio" name="range1a" />
          <span>Quarter</span>
        </label>
        <label className="seg-opt">
          <input type="radio" name="range1a" />
          <span>Year</span>
        </label>
      </div>
      <button className="btn btn-secondary text-[13px]">
        <IconDownload size={14} />
        Statement
      </button>
    </div>
  );
}
