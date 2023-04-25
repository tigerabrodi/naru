export function Kunai() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 23 22">
      <g filter="url(#a)">
        <path
          fill="#FF7E42"
          d="M12.355 14.029a3.146 3.146 0 0 1-2.229-.196c-.32.589-.477 1.34-.578 2.147L2.5 19.647c1.604-4.689 3.667-6.893 5.97-7.792a3.148 3.148 0 0 1 .196-2.229c-.588-.319-1.34-.476-2.147-.578L2.853 2c4.688 1.605 6.892 3.667 7.79 5.971a3.155 3.155 0 0 1 2.23.195c.32-.588.477-1.339.578-2.147L20.5 2.353c-1.605 4.689-3.668 6.893-5.972 7.792a3.149 3.149 0 0 1-.195 2.229c.589.32 1.34.476 2.147.577L20.147 20c-4.69-1.605-6.893-3.667-7.792-5.971Zm-.649-1.423a1.62 1.62 0 1 0-.413-3.213 1.62 1.62 0 0 0 .413 3.213Z"
        />
      </g>
      <defs>
        <filter
          id="a"
          width="22"
          height="22"
          x=".5"
          y="0"
          colorInterpolation="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            result="hardAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.494118 0 0 0 0 0.258824 0 0 0 1 0" />
          <feBlend
            in2="BackgroundImageFix"
            result="effect1_dropShadow_549_1250"
          />
          <feBlend
            in="SourceGraphic"
            in2="effect1_dropShadow_549_1250"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
