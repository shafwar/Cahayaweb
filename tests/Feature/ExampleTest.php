<?php

it('redirects the site root to the public home', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('b2c.home', absolute: false));
});
