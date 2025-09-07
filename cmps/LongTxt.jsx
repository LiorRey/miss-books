const { useState, useEffect } = React

export function LongTxt({ txt, length = 100, classNameFromPreview = "" }) {
  const [isFullText, setIsFullText] = useState(false)

  useEffect(() => {
    setIsFullText(false)
  }, [txt])

  function onReadMoreLessClick() {
    setIsFullText(prevIsFullText => !prevIsFullText)
  }

  function getUpdatedTxt() {
    return txt.length <= length || isFullText
      ? txt
      : txt.slice(0, length) + "..."
  }

  function getReadMoreLessLabel() {
    return !isFullText ? "... Read more" : "Show less"
  }

  return (
    <div>
      <h3 className="no-margin-block-end">Description:</h3>
      <h3 className={`${classNameFromPreview} no-margin-block-start`}>
        {getUpdatedTxt()}
      </h3>
      {txt.length > length && (
        <h3
          className={`${classNameFromPreview} clickable-text`}
          onClick={onReadMoreLessClick}
        >
          {getReadMoreLessLabel()}
        </h3>
      )}
    </div>
  )
}
