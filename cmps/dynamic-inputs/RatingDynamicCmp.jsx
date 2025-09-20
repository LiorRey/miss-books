import { RateBySelect } from "./RateBySelect.jsx"
import { RateByTextbox } from "./RateByTextbox.jsx"
import { RateByStars } from "./RateByStars.jsx"

const cmpMap = {
  select: RateBySelect,
  textbox: RateByTextbox,
  stars: RateByStars,
}

export function RatingDynamicCmp({ val, handleRatingChange, ratingCmpType }) {
  const Component = cmpMap[ratingCmpType]

  return <Component val={val} handleRatingChange={handleRatingChange} />
}
