import clsx from "clsx"

const Background = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
      <div className={clsx("absolute inset-0", "bg-linear-to-br from-(--bg) via-(--bg) to-(--bg)/70")} />

      <div
        className={clsx(
          "absolute w-[500px] h-[500px] rounded-full",
          "bg-linear-to-br from-(--heading)/20 via-(--text)/15 to-transparent",
          "blur-3xl animate-orb-float-1",
        )}
        style={{ top: "-10%", left: "-15%" }}
      />
      <div
        className={clsx(
          "absolute w-[400px] h-[400px] rounded-full",
          "bg-linear-to-br from-(--text)/15 via-(--surface)/10 to-transparent",
          "blur-3xl animate-orb-float-2",
        )}
        style={{ top: "40%", right: "-20%" }}
      />
      <div
        className={clsx(
          "absolute w-[350px] h-[350px] rounded-full",
          "bg-linear-to-br from-(--surface)/12 via-(--heading)/8 to-transparent",
          "blur-3xl animate-orb-float-3",
        )}
        style={{ bottom: "-5%", left: "20%" }}
      />

      <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-(--bg)/50" />
    </div>
  )
}

export default Background
