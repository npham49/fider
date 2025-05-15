import "./ImageUploader.scss"

import React, { useRef, useState } from "react"
import { ValidationContext } from "./Form"
import { DisplayError, hasError } from "./DisplayError"
import { classSet, fileToBase64, uploadedImageURL } from "@fider/services"
import { Button, Icon, Modal } from "@fider/components"
import { ImageUpload } from "@fider/models"
import IconPhotograph from "@fider/assets/images/heroicons-photograph.svg"

const hardFileSizeLimit = 5 * 1024 * 1024

interface ImageUploaderProps {
  children?: React.ReactNode
  instanceID?: string
  field: string
  label?: string
  bkey?: string
  disabled?: boolean
  onChange(state: ImageUpload, instanceID?: string, previewURL?: string): void
}

interface ImageUploaderState extends ImageUpload {
  previewURL?: string
}

export const ImageUploader = (props: ImageUploaderProps) => {
  const [state, setState] = useState<ImageUploaderState>({
    upload: undefined,
    remove: false,
    previewURL: uploadedImageURL(props.bkey),
  })

  const [showModal, setShowModal] = useState(false)

  const fileSelector = useRef<HTMLInputElement>(null)

  const fileChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > hardFileSizeLimit) {
        alert("The image size must be smaller than 5MB.")
        return
      }

      const base64 = await fileToBase64(file)
      setState({
        bkey: props.bkey,
        upload: {
          fileName: file.name,
          content: base64,
          contentType: file.type,
        },
        remove: false,
        previewURL: `data:${file.type};base64,${base64}`,
      })
      props.onChange(state, props.instanceID, state.previewURL)
    }
  }

  const removeFile = async () => {
    if (fileSelector.current) {
      fileSelector.current.value = ""
    }

    setState({
      bkey: props.bkey,
      remove: true,
      upload: undefined,
      previewURL: undefined,
    })
    props.onChange(state, props.instanceID, state.previewURL)
  }

  const selectFile = async () => {
    if (fileSelector.current) {
      fileSelector.current.click()
    }
  }

  const openModal = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const ImageModal = () => (
    <Modal.Window className="c-image-viewer-modal" isOpen={showModal} onClose={closeModal} center={false} size="fluid">
      <Modal.Content>{props.bkey ? <img alt="" src={uploadedImageURL(props.bkey)} /> : <img alt="" src={state.previewURL} />}</Modal.Content>

      <Modal.Footer>
        <Button variant="tertiary" onClick={closeModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal.Window>
  )
  return (
    <ValidationContext.Consumer>
      {(ctx) => (
        <div
          className={classSet({
            "c-form-field": true,
            "c-image-upload": true,
            "m-error": hasError(props.field, ctx.error),
          })}
        >
          <ImageModal />
          {props.label && <label htmlFor={`input-${props.field}`}>{props.label}</label>}

          {(!state.remove && props.bkey) ||
            (!!state.upload && (
              <div className="preview h-20">
                <img alt="" onClick={openModal} src={state.previewURL} />
                {!props.disabled && (
                  <Button onClick={removeFile} variant="danger">
                    X
                  </Button>
                )}
              </div>
            ))}

          <input ref={fileSelector} type="file" onChange={fileChanged} accept="image/*" />
          {!(!state.remove && props.bkey) ||
            (!!state.upload && (
              <Button onClick={selectFile} disabled={props.disabled}>
                <Icon sprite={IconPhotograph} />
              </Button>
            ))}
          <DisplayError fields={[props.field]} error={ctx.error} />
          {props.children}
        </div>
      )}
    </ValidationContext.Consumer>
  )
}
