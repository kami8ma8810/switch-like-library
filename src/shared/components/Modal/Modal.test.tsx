import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('isOpenがtrueの時にモーダルを表示する', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>モーダルコンテンツ</div>
      </Modal>
    )

    expect(screen.getByText('モーダルコンテンツ')).toBeInTheDocument()
  })

  it('isOpenがfalseの時はモーダルを表示しない', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>モーダルコンテンツ</div>
      </Modal>
    )

    expect(screen.queryByText('モーダルコンテンツ')).not.toBeInTheDocument()
  })

  it('タイトルを表示する', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="テストタイトル">
        <div>コンテンツ</div>
      </Modal>
    )

    expect(screen.getByText('テストタイトル')).toBeInTheDocument()
  })

  it('閉じるボタンをクリックするとonCloseが呼ばれる', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>コンテンツ</div>
      </Modal>
    )

    await user.click(screen.getByLabelText('閉じる'))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('オーバーレイをクリックするとonCloseが呼ばれる', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>コンテンツ</div>
      </Modal>
    )

    const overlay = screen.getByTestId('modal-overlay')
    await user.click(overlay)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('モーダル内部をクリックしてもonCloseは呼ばれない', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>コンテンツ</div>
      </Modal>
    )

    await user.click(screen.getByText('コンテンツ'))
    expect(handleClose).not.toHaveBeenCalled()
  })

  it('Escapeキーを押すとonCloseが呼ばれる', async () => {
    const handleClose = vi.fn()
    const user = userEvent.setup()
    
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>コンテンツ</div>
      </Modal>
    )

    await user.keyboard('{Escape}')
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})