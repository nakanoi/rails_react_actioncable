class Api::V1::RoomsController < ApplicationController
  # ログインユーザーのみRoomsにアクセスできるようにする
  before_action :authenticate_api_v1_user!, only: [:index, :create, :show]

  # ログインユーザー(current_api_v1_user)のもつ(has_many)Roomsを返す
  def index
    rooms = current_api_v1_user.rooms
    render json: rooms
  end

  # url(/rooms/[token])からRoomを探し、
  # そのroomがもつMembersとMessagesも一緒に返す
  def show
    room = Room.find_by(token: params[:id])
    if room
      render json: {
        status: 200,
        id: room.id,
        title: room.title,
        users: room.users,
        messages: room.messages,
      }
    else
      render json: {
        status: 404,
        message: "no rooms for the token."
      }
    end
  end

  # パラメータのtitle, tokenからRoomを作成
  def create
    room = Room.new(
      title: room_params[:title],
      token: room_params[:token],
    )
    if room.save
      member = Member.new(
        user_id: current_api_v1_user.id,
        room_id: room.id,
      ).save
      member = Member.new(
        user_id: room_params[:partner],
        room_id: room.id,
      ).save
      render json: room
    else
      render json: {
        status: 400,
        message: "invalid paramators",
      }
    end
  end

  private
    def room_params
      params.permit(:title, :token, :partner)
    end
end
