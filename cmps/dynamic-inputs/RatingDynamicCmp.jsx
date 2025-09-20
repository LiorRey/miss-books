import { RateBySelect } from "./RateBySelect.jsx"
import { RateByTextbox } from "./RateByTextbox.jsx"
import { RateByStars } from "./RateByStars.jsx"

export function RatingDynamicCmp(props) {
  const cmpMap = {
    select: <RateBySelect {...props} />,
    textbox: <RateByTextbox {...props} />,
    stars: <RateByStars {...props} />,
  }

  return cmpMap[props.ratingCmpType]
}
