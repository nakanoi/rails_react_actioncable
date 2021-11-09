class RoomsChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    @room = Room.find_by(token: params[:token])
    stream_for @room
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
