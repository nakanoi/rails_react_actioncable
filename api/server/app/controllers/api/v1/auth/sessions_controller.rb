class Api::V1::Auth::SessionsController < ApplicationController
  def index
    if current_api_v1_user
      render json: {
        is_login: true,
        user: current_api_v1_user,
        message: 'Logged in.',
        rooms: current_api_v1_user.rooms,
      }
    else
      render json: {
        is_login: false,
        user: [],
        message: 'User does not exist.',
        rooms: [],
      }
    end
  end
end
